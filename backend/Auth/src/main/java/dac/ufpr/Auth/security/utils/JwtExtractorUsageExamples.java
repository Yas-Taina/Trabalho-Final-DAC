package dac.ufpr.Auth.security.utils;

/**
 * ============================================================================
 *  JWT EXTRACTOR - USAGE EXAMPLES
 * ============================================================================
 *
 * The JwtExtractor component provides a reusable way to access JWT data
 * in your controllers and services. Here are common usage patterns:
 *
 * SETUP:
 * ------
 * 1. Inject JwtExtractor into your controller/service:
 *
 *    @RestController
 *    @RequiredArgsConstructor
 *    public class MyController {
 *        private final JwtExtractor jwtExtractor;
 *        ...
 *    }
 *
 * ============================================================================
 *  USAGE PATTERNS
 * ============================================================================
 *
 * 1. GET AUTHENTICATED USER (username/email)
 *    ----------------------------------------
 *    Option A: Using Optional (recommended)
 *    String user = jwtExtractor.getAuthenticatedUser()
 *        .orElseThrow(() -> new UnauthorizedException("User not authenticated"));
 *
 *    Option B: With default value
 *    String user = jwtExtractor.getAuthenticatedUserOrDefault("ANONYMOUS");
 *
 *    Option C: With ifPresentOrElse
 *    jwtExtractor.getAuthenticatedUser().ifPresentOrElse(
 *        user -> System.out.println("User: " + user),
 *        () -> System.out.println("Not authenticated")
 *    );
 *
 *
 * 2. GET USER ROLE
 *    ---------------
 *    Option A: Using Optional
 *    String role = jwtExtractor.getAuthenticatedRole()
 *        .orElse("ROLE_USER");
 *
 *    Option B: Check if user has specific role
 *    boolean isAdmin = jwtExtractor.getAuthenticatedRole()
 *        .map(role -> role.equals("ADMIN"))
 *        .orElse(false);
 *
 *
 * 3. GET CUSTOM CLAIM VALUES
 *    -----------------------
 *    Option A: As Object
 *    Object customData = jwtExtractor.getClaimValue("customClaim")
 *        .orElse(null);
 *
 *    Option B: As specific type
 *    String departmentId = jwtExtractor.getClaimValue("departmentId", String.class)
 *        .orElse("DEFAULT");
 *
 *    Integer userId = jwtExtractor.getClaimValue("userId", Integer.class)
 *        .orElse(0);
 *
 *
 * 4. GET ALL CLAIMS
 *    ---------------
 *    io.jsonwebtoken.Claims claims = jwtExtractor.getAllClaims()
 *        .orElseThrow(() -> new UnauthorizedException("Invalid token"));
 *
 *    String subject = claims.getSubject();
 *    Date issuedAt = claims.getIssuedAt();
 *    Date expiration = claims.getExpiration();
 *
 *
 * 5. EXTRACT FROM TOKEN STRING (outside request context)
 *    ---------------------------------------------------
 *    Option A: Get all claims from token
 *    io.jsonwebtoken.Claims claims = jwtExtractor.extractClaimsFromToken(tokenString)
 *        .orElse(null);
 *
 *    Option B: Get user from token
 *    String user = jwtExtractor.extractUserFromToken(tokenString)
 *        .orElse("UNKNOWN");
 *
 *    Option C: Get role from token
 *    String role = jwtExtractor.extractRoleFromToken(tokenString)
 *        .orElse("ROLE_USER");
 *
 *
 * ============================================================================
 *  COMPLETE CONTROLLER EXAMPLE
 * ============================================================================
 *
 * @RestController
 * @RequestMapping("/api/users")
 * @RequiredArgsConstructor
 * public class UserController {
 *
 *     private final UserService userService;
 *     private final JwtExtractor jwtExtractor;
 *
 *     @GetMapping("/profile")
 *     public ResponseEntity<?> getProfile() {
 *         String username = jwtExtractor.getAuthenticatedUser()
 *             .orElseThrow(() -> new UnauthorizedException("Not authenticated"));
 *
 *         String role = jwtExtractor.getAuthenticatedRole()
 *             .orElse("ROLE_USER");
 *
 *         UserDto user = userService.findByUsername(username);
 *         return ResponseEntity.ok(user);
 *     }
 *
 *     @GetMapping("/data")
 *     public ResponseEntity<?> getUserData() {
 *         String userId = jwtExtractor.getClaimValue("userId", String.class)
 *             .orElseThrow(() -> new UnauthorizedException("User ID not found in token"));
 *
 *         DataDto data = userService.getUserData(userId);
 *         return ResponseEntity.ok(data);
 *     }
 * }
 *
 *
 * ============================================================================
 *  COMPLETE SERVICE EXAMPLE
 * ============================================================================
 *
 * @Service
 * @RequiredArgsConstructor
 * public class OrderService {
 *
 *     private final OrderRepository orderRepository;
 *     private final JwtExtractor jwtExtractor;
 *
 *     public OrderDto createOrder(CreateOrderRequest request) {
 *         String userId = jwtExtractor.getAuthenticatedUser()
 *             .orElseThrow(() -> new UnauthorizedException("Cannot create order without authentication"));
 *
 *         Order order = new Order();
 *         order.setUserId(userId);
 *         order.setItems(request.getItems());
 *
 *         return OrderDto.fromEntity(orderRepository.save(order));
 *     }
 *
 *     public boolean canDeleteOrder(Long orderId) {
 *         String userId = jwtExtractor.getAuthenticatedUserOrDefault("");
 *         String role = jwtExtractor.getAuthenticatedRoleOrDefault("ROLE_USER");
 *
 *         // Admin can delete any order
 *         if ("ADMIN".equals(role)) {
 *             return true;
 *         }
 *
 *         // Users can only delete their own orders
 *         Order order = orderRepository.findById(orderId)
 *             .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
 *
 *         return order.getUserId().equals(userId);
 *     }
 * }
 *
 *
 * ============================================================================
 *  ERROR HANDLING PATTERNS
 * ============================================================================
 *
 * // Pattern 1: Throw exception if not authenticated
 * String user = jwtExtractor.getAuthenticatedUser()
 *     .orElseThrow(() -> new UnauthorizedException("Authentication required"));
 *
 * // Pattern 2: Use default value
 * String user = jwtExtractor.getAuthenticatedUserOrDefault("GUEST");
 *
 * // Pattern 3: Return Optional and handle later
 * Optional<String> maybeUser = jwtExtractor.getAuthenticatedUser();
 * if (maybeUser.isPresent()) {
 *     // Do something with user
 * }
 *
 * // Pattern 4: Use map/filter chain
 * boolean isAdminUser = jwtExtractor.getAuthenticatedRole()
 *     .map(role -> role.equals("ADMIN"))
 *     .orElse(false);
 *
 * ============================================================================
 */
public class JwtExtractorUsageExamples {
    // This is a documentation file - no implementation needed
}
