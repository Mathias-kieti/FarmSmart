package com.farmsmart.backend.config;

import java.io.IOException;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(name = "farmsmart.auth.mode", havingValue = "firebase", matchIfMissing = true)
public class FirebaseConfig {

    @Bean
    FirebaseAuth firebaseAuth(@Value("${farmsmart.firebase.project-id}") String projectId) throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.getApplicationDefault())
                    .setProjectId(projectId)
                    .build();
            FirebaseApp.initializeApp(options);
        }

        return FirebaseAuth.getInstance();
    }
}
