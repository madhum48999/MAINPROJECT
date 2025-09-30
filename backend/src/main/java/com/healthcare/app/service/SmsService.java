package com.healthcare.app.service;

import org.springframework.stereotype.Service;

@Service
public class SmsService {

    public void sendSms(String phone, String message) {
        // Mock SMS sending - in real implementation, integrate with Twilio or similar
        System.out.println("Sending SMS to " + phone + ": " + message);
    }
}
