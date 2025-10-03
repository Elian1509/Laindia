package com.beelzebud.invSales_System;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BcryptGen {
    public static void main(String[] args) {
        String pw = "cajero123";
        BCryptPasswordEncoder enc = new BCryptPasswordEncoder();
        System.out.println(enc.encode(pw));
    }

}
