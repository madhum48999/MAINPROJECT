package com.healthcare.app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String toEmail, String otp) {
        // For development/testing purposes, log the OTP instead of sending email
        // In production, uncomment the email sending code below
        System.out.println("=== PASSWORD RESET OTP ===");
        System.out.println("Email: " + toEmail);
        System.out.println("OTP: " + otp);
        System.out.println("This OTP will expire in 10 minutes.");
        System.out.println("===========================");

        // Uncomment the following lines for production email sending:
        /*
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Password Reset OTP - Healthcare System");
        message.setText("Your OTP for password reset is: " + otp + "\n\nThis OTP will expire in 10 minutes.\n\nIf you didn't request this, please ignore this email.");
        mailSender.send(message);
        */
    }
}
