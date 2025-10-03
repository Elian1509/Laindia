package com.beelzebud.invSales_System;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class InvSalesSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(InvSalesSystemApplication.class, args);
	}

	public class BcryptGen {
		public static void main(String[] args) {
			String pw = "admin123"; // cambia por la contraseña que quieras
			BCryptPasswordEncoder enc = new BCryptPasswordEncoder();
			System.out.println(enc.encode(pw));
		}

	}
}
