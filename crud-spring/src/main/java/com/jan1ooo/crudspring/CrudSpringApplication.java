package com.jan1ooo.crudspring;

import com.jan1ooo.crudspring.enums.Category;
import com.jan1ooo.crudspring.model.Course;
import com.jan1ooo.crudspring.model.Lesson;
import com.jan1ooo.crudspring.repository.CourseRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.ArrayList;
import java.util.Arrays;

@SpringBootApplication
public class CrudSpringApplication {

	public static void main(String[] args) {
		SpringApplication.run(CrudSpringApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(CourseRepository courseRepository){
		return args -> {
			courseRepository.deleteAll();
			Course c = new Course();
			Course c1 = new Course();
			c.setName("Angular");
			c.setCategory(Category.FRONTEND);
			c.setHours(80);
			Lesson l = new Lesson();
			l.setName("Introdução");
			l.setYoutubeUrl("https://youtu.be/pTIhNB_ulM8");
			l.setCourse(c);

			Lesson l2 = new Lesson();
			l2.setName("Teste 2");
			l2.setYoutubeUrl("https://youtu.be/pTIhNB_ulM8");
			l2.setCourse(c);
			c.getLessons().add(l);
			c.getLessons().add(l2);

//			c1.setName("React");
//			c1.setCategory(Category.FRONTEND);
//			c1.setHours(100);
			courseRepository.save(c);
//			courseRepository.save(c1);
		};
	}

}
