package com.beelzebud.invSales_System.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    
    private final Key key = Keys.hmacShaKeyFor("tuClaveSecretaDeAlMenos32Caracteres".getBytes());

    // 1 hora 
    private final long EXPIRATION_TIME = 1000 * 60 * 60;

    // Genera token con rol 
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key)
                .compact();
    }

    // Extraer username
    public String extractUsername(String token) {
        return getAllClaims(token).getSubject();
    }

    // Extraer rol
    public String extractRole(String token) {
        return getAllClaims(token).get("role", String.class);
    }

    // Validar expiración
    public boolean validateToken(String token, String username) {
        return extractUsername(token).equals(username) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return getAllClaims(token).getExpiration().before(new Date());
    }

    private Claims getAllClaims(String token) {
        return Jwts.parser()  
                .setSigningKey(key)   
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
