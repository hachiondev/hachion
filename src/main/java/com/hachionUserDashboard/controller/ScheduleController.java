package com.hachionUserDashboard.controller;

import java.util.List;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.entity.CourseSchedule;
import com.hachionUserDashboard.repository.CourseScheduleRepository;

import Service.Schedule; 
@CrossOrigin
//@CrossOrigin(origins = {"http://localhost:3000", "http://hachion.co"})

 @RestController 
  


public class ScheduleController {
	
	
	    private Schedule scheduleservice = null;

	    @Autowired
	    CourseScheduleRepository repo;
	    public ScheduleController(Schedule userService) {
	        this.setScheduleservice(userService);
	    }

	


		@GetMapping("/schedulecourse/{id}") public CourseSchedule getCourseSchedule(@PathVariable Integer id) {
		 CourseSchedule courseschedule=repo.findById(id).get();
		 return courseschedule;
				   }
		 
	
		 
	    
//	    @GetMapping("/trainers/{id}")
//	    public Trainer getTrainer(@PathVariable int id) {
//	    Trainer trainer=	repo.findById(id).get()	;
//		return null;
//	    	}
		 @GetMapping("/schedulecourse")
public List<CourseSchedule>getAllCourseSchedule(){
	List<CourseSchedule>courseschedule=	repo.findAll();
	return courseschedule;
}
		 @PostMapping("/schedulecourse/add")
		 @ResponseStatus(code= HttpStatus.CREATED)
		 public void createCourse(@RequestBody CourseSchedule courseschedule) {
			 repo.save(courseschedule);
		 }

			/*
			 * @PutMapping("trainer/update/{id}") public Trainer
			 * updateTrainers(@PathVariable int id) { Trainer trainer=
			 * repo.findById(id).get(); trainer.setTrainer_name("");
			 * trainer.setCategory_name(""); repo.save(trainer); return trainer; }
			 */

		 @PutMapping("/schedulecourse/update/{id}")
		 public ResponseEntity<CourseSchedule> updateCourseSchedule(@PathVariable int id, @RequestBody CourseSchedule updatedCourseSchedule) {
		     Optional<CourseSchedule> optionalCourseSchedule = repo.findById(id);

		     if (optionalCourseSchedule.isPresent()) {
		         CourseSchedule courseschedule = optionalCourseSchedule.get();
		         
		         // Set the new values for the trainer
		         courseschedule.setSchedule_course_name(updatedCourseSchedule.getSchedule_course_name());
		         courseschedule.setSchedule_category_name(updatedCourseSchedule.getSchedule_category_name());
		         courseschedule.setSchedule_duration(updatedCourseSchedule.getSchedule_duration());
		         courseschedule.setSchedule_mode(updatedCourseSchedule.getSchedule_mode());
		         courseschedule.setSchedule_time(updatedCourseSchedule.getSchedule_time());
		         courseschedule.setSchedule_week(updatedCourseSchedule.getSchedule_week());
		         courseschedule.setSchedule_date(updatedCourseSchedule.getSchedule_date());
		      
		         
		         // Save the updated trainer to the repository
		         repo.save(courseschedule);
		         
		         return ResponseEntity.ok(courseschedule); // Return the updated trainer and 200 OK
		     } else {
		         // Return 404 Not Found if the trainer ID does not exist
		         return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		     }
		 }

  @DeleteMapping("schedulecourse/delete/{id}") public ResponseEntity<?>
  deleteCourseSchedule(@PathVariable int id) { CourseSchedule courseschedule=
  repo.findById(id).get(); repo.delete(courseschedule); return null;
  
  }


public Schedule getScheduleservice() {
	return scheduleservice;
}


public void setScheduleservice(Schedule scheduleservice) {
	this.scheduleservice = scheduleservice;
}
 
/*
 * @DeleteMapping("trainer/delete/{id}") public ResponseEntity<?>
 * deleteTrainer(@PathVariable Long id) {
 * System.out.println("Received trainerId: " + id); // Log to console return
 * ResponseEntity.ok("Trainer deleted successfully"); }
 * 
 */

}