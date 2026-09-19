package com.hachionUserDashboard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.entity.Course;
import com.hachionUserDashboard.repository.BlogRepository;
import com.hachionUserDashboard.repository.CourseRepository;

@RestController
public class SitemapController {

	@Autowired
	private CourseRepository courseRepository;

	@Autowired
	private BlogRepository blogRepository;

	@GetMapping(value = "/sitemap.xml", produces = "application/xml")
	public String sitemap() {

		List<Course> courses = courseRepository.findAll();
		List<Object[]> blogs = blogRepository.findAllBlogColumns();

		StringBuilder xml = new StringBuilder();
		xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
		xml.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");

		// Home
		xml.append(buildUrl("https://www.hachion.co/", "daily", "1.0"));

		for (Course course : courses) {

			if (course.getCourseName() == null || course.getCourseCategory() == null)
				continue;

			String categorySlug = generateSlug(course.getCourseCategory());
			String courseSlug = generateSlug(course.getCourseName());

			xml.append(buildUrl("https://www.hachion.co/courses/" + categorySlug + "/" + courseSlug, "daily", "0.9"));

		}
		for (Object[] row : blogs) {

			String category = (String) row[0];
			String shortTitle = (String) row[1];

			String blogUrl = "https://www.hachion.co/blogs/"
			        + generateSlug(category)
			        + "/"
			        + generateSlug(shortTitle);

			xml.append(buildUrl(blogUrl, "weekly", "0.8"));
		}

		xml.append(buildUrl("https://www.hachion.co/summer-tech-bootcamp-for-teens", "monthly", "0.8"));
		xml.append(buildUrl("https://www.hachion.co/workshop", "monthly", "0.7"));
		xml.append(buildUrl("https://www.hachion.co/contactus", "yearly", "0.5"));
		xml.append(buildUrl("https://www.hachion.co/aboutus", "yearly", "0.5"));

		xml.append("</urlset>");
		return xml.toString();
	}

	private String generateSlug(String courseName) {

	    if (courseName == null || courseName.trim().isEmpty()) {
	        return "";
	    }

	    return courseName.toLowerCase().trim().replaceAll("\\s+", "-");
	}

	private String buildUrl(String loc, String freq, String priority) {
		return "<url>" + "<loc>" + escapeXml(loc) + "</loc>" + "<changefreq>" + freq + "</changefreq>" + "<priority>"
				+ priority + "</priority>" + "</url>";
	}

	private String escapeXml(String value) {
		return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;")
				.replace("'", "&apos;");
	}

}