package com.hachionUserDashboard.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.hachionUserDashboard.entity.Query;
import com.hachionUserDashboard.entity.RequestBatch;
import com.hachionUserDashboard.repository.QueryRepository;


@CrossOrigin
//@CrossOrigin(origins = {"http://localhost:3000", "http://hachion.co"})
@RestController
public class QueryController {

    @Autowired
    private QueryRepository repo;
    @Autowired
	public JavaMailSender javaMailSender;
	

    @GetMapping("/haveanyquery/{id}")
    public ResponseEntity<Query> getQuery(@PathVariable Integer id) {
        return repo.findById(id)
                   .map(ResponseEntity::ok)
                   .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/haveanyquery")
    public List<Query> getAllQuery() {
        return repo.findAll();
    }

    @PostMapping("/haveanyquery/add")
    public ResponseEntity<?> addQuery(@RequestBody Query queryRequest) {
        // Handle adding the request batch, including userName
        Query query = new Query();
        query.setName(queryRequest.getName());
        query.setEmail(queryRequest.getEmail());
        query.setMobile(queryRequest.getMobile());
        query.setComment(queryRequest.getComment());
       query.setDate(queryRequest.getDate());
       query.setCountry(queryRequest.getCountry());

        // Save requestBatch to the database
        repo.save(query);
        sendQueryEmail(query);
        sendQueryToChat(query);
        return ResponseEntity.ok("Query Submitted successfully");
    }

    public void sendQueryToChat(Query query) {
//        String webhookUrl = "https://chat.googleapis.com/v1/spaces/AAAAf7lFm-A/messages?key=YOUR_KEY&token=YOUR_TOKEN"; // Replace with your actual Webhook URL
        String webhookUrl="https://mail.google.com/chat/u/0/#chat/dm/5nJTysAAAAE";
        String message = String.format(
                "**New Enquiry Received** 📩\n\n" +
                "**👤 Name:** %s\n" +
                "**📧 Email:** %s\n" +
                "**📞 Mobile:** %s\n" +
                "**💬 Comment:** %s\n" +
                "**🌍 Country:** %s\n\n" +
                "🚀 Please follow up with this user!",
                query.getName(), query.getEmail(), query.getMobile(), query.getComment(), query.getCountry()
        );

        // Create JSON payload
        String jsonPayload = String.format("{\"text\": \"%s\"}", message.replace("\"", "\\\""));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        HttpEntity<String> request = new HttpEntity<>(jsonPayload, headers);
        RestTemplate restTemplate = new RestTemplate();
        
        try {
            restTemplate.postForEntity(webhookUrl, request, String.class);
            System.out.println("Message sent to Google Chat successfully!");
        } catch (Exception e) {
            System.err.println("Error sending message to Google Chat: " + e.getMessage());
        }
    }

	public void sendQueryEmail(@RequestBody Query query) {
		SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setTo(query.getEmail());
        simpleMailMessage.setSubject("Hachion Query Submission");

        String message = String.format(
        		"Hii," + query.getName() + "\n" +

        		"Welcome to the Hachion" + "\n"+

        		"We have received your query" +"\n" +
        		 

        		          "Our Business Team will call you shortly or responded in the details provided by you"+ "\n" +
        		
"If you have any questions, please contact our support team at trainings.hachion@gmail.com or call us at 17324852499. We look forward to seeing you there!"+ "\n" +
        		"Best regards,"+ "\n" +
        		"Hachion Business Team "+ "\n" +
        		"Whatsapp: https://wa.me/17324852499");
              
        

        simpleMailMessage.setText(message);
        SimpleMailMessage supportMail = new SimpleMailMessage();
        supportMail.setTo("trainings@hachion.co"); // Replace with the actual support email ID
        supportMail.setSubject("Have any Query?");
        supportMail.setText("Dear Support Team,\n\n" +
                "The following user has raise a query:\n" +
                "Name: " + query.getName() + "\n" +
                "Email: " + query.getEmail() + "\n" +
                "Mobile: " + query.getMobile() + "\n" +
                "Comment: " + query.getComment() + "\n" +
               
                "Please contact the user to assist them further.\n\n" +
                "Best Regards,\nSystem Notification");

        // Send emails
     
        javaMailSender.send(supportMail);
        javaMailSender.send(simpleMailMessage);
    }
	@DeleteMapping("haveanyquery/delete/{id}") public ResponseEntity<?>
    deleteQuery(@PathVariable int id) { Query query=
    repo.findById(id).get(); repo.delete(query); return null;
    
    }
}