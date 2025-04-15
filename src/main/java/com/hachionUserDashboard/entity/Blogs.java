package com.hachionUserDashboard.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "blogs")
public class Blogs {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column// Ensure the field is required and set a max length
	private String category_name;

	@Column // Ensure the field is required and set a max length
	private String title;

	@Column // Ensure the field is required and set a max length
	private String author;

	@Column // Ensure the field is required
	private String blog_image; // URL or file path to the image

	@Column // Ensure the field is required
	private String blog_pdf; // URL or file path to the PDF

	@Column(nullable = true, length = 500) // Allow longer descriptions
	private String description;

	@Column
	private String meta_title;
	
	@Column
	private String meta_description;
	
	@Column
	private String meta_keyword;
	@Column(name = "date") 
	private LocalDate date;

public Blogs() {
}

public int getId() {
	return id;
}

public void setId(int id) {
	this.id = id;
}

public String getCategory_name() {
	return category_name;
}

public void setCategory_name(String category_name) {
	this.category_name = category_name;
}

public String getTitle() {
	return title;
}

public void setTitle(String title) {
	this.title = title;
}

public String getAuthor() {
	return author;
}

public void setAuthor(String author) {
	this.author = author;
}

public String getBlog_image() {
	return blog_image;
}

public void setBlog_image(String blog_image) {
	this.blog_image = blog_image;
}

public String getBlog_pdf() {
	return blog_pdf;
}

public void setBlog_pdf(String blog_pdf) {
	this.blog_pdf = blog_pdf;
}

public String getDescription() {
	return description;
}

public void setDescription(String description) {
	this.description = description;
}

public LocalDate getDate() {
	return date;
}

public void setDate(LocalDate date) {
	this.date = date;
}


public String getMeta_title() {
	return meta_title;
}

public void setMeta_title(String meta_title) {
	this.meta_title = meta_title;
}

public String getMeta_description() {
	return meta_description;
}

public void setMeta_description(String meta_description) {
	this.meta_description = meta_description;
}

public String getMeta_keyword() {
	return meta_keyword;
}

public void setMeta_keyword(String meta_keyword) {
	this.meta_keyword = meta_keyword;
}

@Override
public String toString() {
	return "Blogs [id=" + id + ", category_name=" + category_name + ", title=" + title + ", author=" + author
			+ ", blog_image=" + blog_image + ", blog_pdf=" + blog_pdf + ", description=" + description + ", meta_title="
			+ meta_title + ", meta_description=" + meta_description + ", meta_keyword=" + meta_keyword + ", date="
			+ date + "]";
}

public Blogs(int id, String category_name, String title, String author, String blog_image, String blog_pdf,
		String description,String meta_title, String meta_description, String meta_keyword, LocalDate date) {
	super();
	this.id = id;
	this.category_name = category_name;
	this.title = title;
	this.author = author;
	this.blog_image = blog_image;
	this.blog_pdf = blog_pdf;
	this.meta_title=meta_title;
	this.meta_description=meta_description;
	this.meta_keyword=meta_keyword;
	this.description = description;
	this.date = date;
}

}
