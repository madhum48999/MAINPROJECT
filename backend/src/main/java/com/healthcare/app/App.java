package com.healthcare.app;

import com.healthcare.app.entity.Admin;
import com.healthcare.app.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class App implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public App(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        if (adminRepository.findByEmail("root").isEmpty()) {
            Admin admin = new Admin();
            admin.setName("Root Admin");
            admin.setEmail("root");
            admin.setPassword(passwordEncoder.encode("password"));
            admin.setRole("ADMIN");
            adminRepository.save(admin);
        }
    }
}
