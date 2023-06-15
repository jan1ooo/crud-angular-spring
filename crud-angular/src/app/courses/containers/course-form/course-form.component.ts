import { Lesson } from './../../model/lesson';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { CoursesService } from '../../service/courses.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../../model/course';

@Component({
	selector: 'app-course-form',
	templateUrl: './course-form.component.html',
	styleUrls: ['./course-form.component.scss'],
})
export class CourseFormComponent implements OnInit {

	form!: FormGroup;

	constructor(
		private formBuilder: NonNullableFormBuilder,
		private service: CoursesService,
		private snackBar: MatSnackBar,
		private locaton: Location,
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		const course: Course = this.route.snapshot.data['course']
		this.form = this.formBuilder.group({
			_id: [course._id],
			name: [course.name, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
			category: [course.category,[Validators.required]],
			hours: [course.hours, [Validators.required, Validators.min(1), Validators.max(500)]],
			lessons: this.formBuilder.array(this.retrieveLessons(course))
		})
	}

	private retrieveLessons(course: Course) {
		const lessons = [];
		if(course?.lessons){
			course.lessons.forEach(lesson => lessons.push(this.createLesson(lesson)));
		} else {
			lessons.push(this.createLesson());
		}
		return lessons;
	}

	private createLesson(lesson: Lesson = {_id: '', name: '', youtubeUrl: ''}){
		return this.formBuilder.group({
			_id: [lesson._id],
			name: [lesson.name],
			youtubeUrl:[lesson.youtubeUrl]
		});
	}

	onSubmit() {
		this.service.save(this.form.value).subscribe(
			(result) => this.onSuccess(),
			(error) => this.onError()
		);
	}

	private onError() {
		this.snackBar.open('Erro ao salvar curso', '', { duration: 5000 });
	}

	private onSuccess() {
		this.snackBar.open('Curso salvo com sucesso', '', { duration: 5000 });
		this.onCancel();
	}

	onCancel() {
		this.locaton.back();
	}

	getErrorMessage(fildName: string) {
		const field = this.form.get(fildName);

		if(field?.hasError('required')){
			return 'Campo Obrigatório';
		}

		if(field?.hasError('minlength')){
			const requiredLength = field.errors ? field.errors['minlength']['requiredLength'] : 3;
			return `Tamanho minímo é ${requiredLength} caracteres`;
		}

		if(field?.hasError('maxlength')){
			const requiredLength = field.errors ? field.errors['maxlength']['requiredLength'] : 100;
			return `Tamanho máximo é ${requiredLength} caracteres`;
		}

		if(field?.hasError('min')){
			return `Mínimo 1h`;
		}

		if(field?.hasError('max')){
			return `Máximo 500h`;
		}

		return 'Campo Inválido'
	}
}
