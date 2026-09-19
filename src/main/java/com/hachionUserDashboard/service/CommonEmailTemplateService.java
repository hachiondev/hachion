package com.hachionUserDashboard.service;

import java.time.Year;

import org.springframework.stereotype.Service;

@Service
public class CommonEmailTemplateService {

	public String buildEmailTemplate(String name, String dynamicContent) {

		String formattedContent = dynamicContent.replace("\n", "<br>");

		return "<html>" +

				"<body style='margin:0; padding:0; background:#ffffff; font-family: Arial, sans-serif;'>" +

				"<div style='max-width:700px; margin:0 auto; background:#ffffff; border:1px solid #eee; border-radius:8px;'>" +

				"<div style='background:#1e4a8d; padding:20px; text-align:center; border-top-left-radius:8px; border-top-right-radius:8px;'>" +

				"<img src='https://www.hachion.co/logo.png' alt='Hachion' style='height:50px; display:block; margin:0 auto;'/>" +

				"</div>" +

				"<div style='padding:25px; color:#333; font-size:16px; line-height:1.6;'>" +

				formattedContent +

				"</div>" +

				"<div style='padding:20px; text-align:center; border-top:1px solid #eee;'>" +

				"<div style='font-size:16px; font-weight:bold; margin-bottom:10px;'>Hachion Support Team</div>" +

				"<div style='margin:6px 0;'>" +

				"<img src='https://img.icons8.com/color/16/whatsapp.png' style='vertical-align:middle; margin-right:6px;'> " +

				"<a href='https://wa.me/17324852499' style='color:#1a73e8; text-decoration:none;'>Chat with us on WhatsApp</a>" +

				"</div>" +

				"<div style='margin:6px 0;'>" +

				"<img src='https://img.icons8.com/color/16/phone.png' style='vertical-align:middle; margin-right:6px;'> " +

				"+1 (469) 639-0198" +

				"</div>" +

				"<div style='margin:6px 0;'>" +

				"<img src='https://img.icons8.com/color/16/email.png' style='vertical-align:middle; margin-right:6px;'> " +

				"trainings@hachion.co" +

				"</div>" +

				"<hr style='border:none; border-top:1px solid #ddd; margin:15px auto; width:80%;'>" +

				"<div style='font-size:13px; color:#666;'>Don’t want to receive emails? " +

				"<a href='https://www.hachion.co/unsubscribe' style='color:#1a73e8;'>Unsubscribe</a></div>" +

				"<div style='margin-top:8px; font-size:12px; color:#888;'>© Hachion "
				+ Year.now().getValue()+". "+

				"All Rights Reserved.</div>" +

				"</div></div></body></html>";
	}
}