package com.ghsms.controller;

import com.ghsms.DTO.LoginRequest;
import com.ghsms.DTO.LoginRespone;
import com.ghsms.DTO.SignupRequestDTO;
import com.ghsms.DTO.UserDTO;
import com.ghsms.file_enum.AuthProvider;
import com.ghsms.file_enum.RoleName;
import com.ghsms.model.Role;
import com.ghsms.model.User;
import com.ghsms.service.JwtService;
import com.ghsms.service.OtpService;
import com.ghsms.service.RoleService;
import com.ghsms.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;



import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final RoleService roleService;
    private final OtpService otpService;
    private final JwtService jwtService;


    @Autowired
    private final PasswordEncoder passwordEncoder;


    @PostMapping(value = "/admin/login", produces = "application/json")
    public ResponseEntity<?> authenticateAdmin(@RequestBody LoginRequest loginRequest) {
        try {
            if (loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Email và mật khẩu không được để trống"
                ));
            }

            String email = loginRequest.getEmail().trim();
            String password = loginRequest.getPassword();

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 🔍 Tìm user trong DB
            User user = userService.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Không tìm thấy người dùng"));
            }

            // Ngăn đăng nhập nếu tài khoản không phải LOCAL
            if (user.getAuthProvider() != AuthProvider.LOCAL) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Tài khoản này không hỗ trợ đăng nhập bằng email và mật khẩu"));
            }



            String token = jwtService.generateToken(user);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "token", token,
                            "user", new UserDTO(user)
                    ));

        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "success", false,
                            "error", "Email hoặc mật khẩu không chính xác"
                    ));
        }
    }

    //Login thủ công customer với role mặc định
    @PostMapping(value = "/customer/login", produces = "application/json")
    public ResponseEntity<?> authenticateCustomer(@RequestBody LoginRequest loginRequest) {
        try {
            if (loginRequest.getEmail() == null || loginRequest.getPassword() == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Email và mật khẩu không được để trống"
                ));
            }

            String email = loginRequest.getEmail().trim();
            String password = loginRequest.getPassword();

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userService.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Không tìm thấy người dùng"));
            }

            if (user.getAuthProvider() != AuthProvider.LOCAL) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Tài khoản này được đăng ký bằng Google, vui lòng đăng nhập bằng Google"));
            }

            if (!user.getIsActive()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Tài khoản của bạn đã bị vô hiệu hóa"));
            }


            // ✅ Tạo JWT
            String token = jwtService.generateToken(user);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "token", token,
                            "user", new UserDTO(user)

                    ));

        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "success", false,
                            "error", "Email hoặc mật khẩu không chính xác"
                    ));
        }
    }




    @PostMapping(value = "/register", produces = "application/json")
    public ResponseEntity<?> registerCustomer(@RequestBody SignupRequestDTO signupRequestDTO) {
        if(signupRequestDTO.getFullName()==null || signupRequestDTO.getFullName().isEmpty()){
            return ResponseEntity.badRequest().body("Họ và tên không được để trống");
        }

        if(signupRequestDTO.getEmail()==null || signupRequestDTO.getEmail().isEmpty()){
            return ResponseEntity.badRequest().body("Email không được để trống");
        }

        if(signupRequestDTO.getPassword()==null || signupRequestDTO.getPassword().isEmpty()){
            return ResponseEntity.badRequest().body("Password không được để trống");
        }

        if (userService.existsByEmail(signupRequestDTO.getEmail())) {
            return ResponseEntity.badRequest().body("Email đã được đăng ký");
        }

        User user = new User();
        user.setName(signupRequestDTO.getFullName());
        user.setEmail(signupRequestDTO.getEmail());
        user.setPhoneNumber(signupRequestDTO.getPhone());
        user.setPasswordHash(signupRequestDTO.getPassword()); // Mã hóa bên trong createUser
        Role customerRole = roleService.findByName(RoleName.ROLE_CUSTOMER);
        user.setAuthProvider(AuthProvider.LOCAL);


        user.setRole(customerRole);

        User savedUser = userService.createUser(user);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Đăng ký thành công",
                "fullName", savedUser.getName(),
                "userId", savedUser.getUserId()
        ));
    }



    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        //kiểm tra đin dạng hoặc null
        if (email == null || !email.endsWith("@gmail.com")) {
            return ResponseEntity.badRequest().body("Email không hợp lệ.");
        }
        boolean result = otpService.sendOtpToEmail(email);
        if (result) {
            return ResponseEntity.ok("OTP đã được gửi đến email.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email không tồn tại trong hệ thống.");
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        boolean valid = otpService.verifyOtp(email, otp);
        if (valid) {
            return ResponseEntity.ok("OTP hợp lệ. Cho phép đổi mật khẩu.");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("OTP không đúng hoặc đã hết hạn.");
        }
    }


    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");

        Optional<User> optionalUser = userService.findOptionalByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Không tìm thấy người dùng.");
        }

        // Verify OTP first
        String otp = request.get("otp");
        if (!otpService.verifyOtp(email, otp)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("OTP không hợp lệ hoặc đã hết hạn.");
        }

        try {
            User user = optionalUser.get();
            // Encode and set the new password
            String encodedPassword = passwordEncoder.encode(newPassword);
            user.setPasswordHash(encodedPassword);

            // Save the updated user to database
            userService.saveUser(user);

            // Clear OTP after successful password reset
            otpService.clearOtp(email);
            return ResponseEntity.ok("Đổi mật khẩu thành công.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra khi cập nhật mật khẩu.");
        }
    }

}