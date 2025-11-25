package com.fintech.digitalbanking.service;

import com.fintech.digitalbanking.entity.Account;
import com.fintech.digitalbanking.entity.AccountType;
import com.fintech.digitalbanking.entity.User;
import com.fintech.digitalbanking.exception.CustomAccessDeniedException;

import com.fintech.digitalbanking.repository.AccountRepository;
import com.fintech.digitalbanking.repository.UserRepository;
import com.fintech.digitalbanking.util.SecurityUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SecurityUtil securityUtil;

    @InjectMocks
    private AccountService accountService;

    private User testUser;
    private Account testAccount;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(1L).username("testuser").selectedAccountId(null).build();
        testAccount = Account.builder()
                .id(10L)
                .user(testUser)
                .accountType(AccountType.SAVINGS)
                .balance(new BigDecimal("1000.00"))
                .active(true)
                .build();
    }

    // --- createAccount Tests ---
    @Test
    void createAccount_shouldSetAsSelected_whenItIsFirstAccount() {
        // Arrange
        when(securityUtil.getCurrentUserEntity()).thenReturn(testUser);
        // Ensure the user's selectedAccountId is null initially
        assertNull(testUser.getSelectedAccountId());

        // When accountRepository.save is called, return the account with an ID
        when(accountRepository.save(any(Account.class))).thenAnswer(invocation -> {
            Account a = invocation.getArgument(0);
            a.setId(15L); // Simulate the DB generating an ID
            return a;
        });

        // Act
        Account createdAccount = accountService.createAccount(AccountType.SAVINGS);

        // Assert
        assertNotNull(createdAccount);
        assertEquals(15L, createdAccount.getId());

        // Verify that the user's selectedAccountId was updated and saved
        verify(userRepository, times(1)).save(testUser);
        assertEquals(15L, testUser.getSelectedAccountId());
    }

    @Test
    void createAccount_shouldNotChangeSelected_whenAccountAlreadySelected() {
        // Arrange
        testUser.setSelectedAccountId(5L); // User already has a selected account
        when(securityUtil.getCurrentUserEntity()).thenReturn(testUser);
        when(accountRepository.save(any(Account.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        accountService.createAccount(AccountType.CURRENT);

        // Assert
        // Verify that userRepository.save() was NOT called to update the selectedId
        verify(userRepository, never()).save(testUser);
        // Verify the selected ID remains unchanged
        assertEquals(5L, testUser.getSelectedAccountId());
    }

    // --- Security and Ownership Tests ---
    @Test
    void getBalance_shouldThrowException_whenUserDoesNotOwnAccount() {
        // Arrange
        User anotherUser = User.builder().id(2L).username("anotheruser").build();
        when(securityUtil.isAdmin()).thenReturn(false);
        when(securityUtil.getCurrentUserEntity()).thenReturn(anotherUser); // Simulate a different user
        when(securityUtil.getCurrentUsername()).thenReturn("anotheruser");
        when(accountRepository.findById(10L)).thenReturn(Optional.of(testAccount)); // Account belongs to 'testuser'

        // Act & Assert
        assertThrows(CustomAccessDeniedException.class, () -> {
            accountService.getBalance(10L);
        });
    }

    @Test
    void getBalance_shouldSucceed_whenAdminAccessesAccount() {
        // Arrange
        when(securityUtil.isAdmin()).thenReturn(true); // Simulate an admin user
        when(accountRepository.findById(10L)).thenReturn(Optional.of(testAccount));

        // Act
        BigDecimal balance = accountService.getBalance(10L);

        // Assert
        assertEquals(new BigDecimal("1000.00"), balance);
        // Verify ownership check was bypassed (getCurrentUserEntity is never called)
        verify(securityUtil, never()).getCurrentUserEntity();
    }

    // --- selectAccount Test ---
    @Test
    void selectAccount_shouldUpdateUserAndSaveChanges() {
        // Arrange
        Long newSelectedAccountId = 10L;
        when(securityUtil.getCurrentUserEntity()).thenReturn(testUser);
        when(securityUtil.isAdmin()).thenReturn(false); // Needed for validateAccountOwnership
        when(accountRepository.findById(10L)).thenReturn(Optional.of(testAccount));

        // Act
        accountService.selectAccount(newSelectedAccountId);

        // Assert
        // Verify that userRepository.save was called on the updated user
        verify(userRepository, times(1)).save(testUser);
        // Assert that the user object now has the new selected account ID
        assertEquals(newSelectedAccountId, testUser.getSelectedAccountId());
    }
}