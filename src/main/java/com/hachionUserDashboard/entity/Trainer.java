package com.hachionUserDashboard.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Table;

@Entity
@Table(name = "trainer")
public class Trainer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int trainer_id;
    
    @Column
    private String trainer_name;
    
    @Column
    private String category_name;
    
    @Column
    private String course_name;
    
    @Lob
	@Column(nullable = true, columnDefinition = "LONGTEXT")
    private String summary;
    
    @Column
    private String demo_link_1;
    
    @Column
    private String demo_link_2;
    
    @Column
    private String demo_link_3;
    
    @Column(name = "date")  // Make sure the name matches your SQL column
    private LocalDate date;

    
    public Trainer() {
    }

    public Trainer(String trainer_name, String category_name, String course_name, String summary, String demo_link_1,
                   String demo_link_2, String demo_link_3,int date) {
        this.trainer_name = trainer_name;
        this.category_name = category_name;
        this.course_name = course_name;
        this.summary = summary;
        this.demo_link_1 = demo_link_1;
        this.demo_link_2 = demo_link_2;
        this.demo_link_3 = demo_link_3;
       
    }

    public int getTrainer_id() {
        return trainer_id;
    }

    public void setTrainer_id(int trainer_id) {
        this.trainer_id = trainer_id;
    }

    public String getTrainer_name() {
        return trainer_name;
    }

    public void setTrainer_name(String trainer_name) {
        this.trainer_name = trainer_name;
    }

    public String getCategory_name() {
        return category_name;
    }

    public void setCategory_name(String category_name) {
        this.category_name = category_name;
    }

    public String getCourse_name() {
        return course_name;
    }

    public void setCourse_name(String course_name) {
        this.course_name = course_name;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getDemo_link_1() {
        return demo_link_1;
    }

    public void setDemo_link_1(String demo_link_1) {
        this.demo_link_1 = demo_link_1;
    }

    public String getDemo_link_2() {
        return demo_link_2;
    }

    public void setDemo_link_2(String demo_link_2) {
        this.demo_link_2 = demo_link_2;
    }

    public String getDemo_link_3() {
        return demo_link_3;
    }

    public void setDemo_link_3(String demo_link_3) {
        this.demo_link_3 = demo_link_3;
    }
    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

  

    @Override
    public String toString() {
        return "Trainer [trainer_id=" + trainer_id + ", trainer_name=" + trainer_name + ", category_name="
                + category_name + ", course_name=" + course_name + ", summary=" + summary + ", demo_link_1="
                + demo_link_1 + ", demo_link_2=" + demo_link_2 + ", demo_link_3=" + demo_link_3 + ", date=" + date + "]";
    }
}
