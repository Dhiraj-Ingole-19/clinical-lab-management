package com.fintech.digitalbanking.service;

import com.fintech.digitalbanking.entity.Account;
import com.fintech.digitalbanking.entity.Transaction;
import com.fintech.digitalbanking.entity.TransactionType;
import com.fintech.digitalbanking.entity.User;
import com.fintech.digitalbanking.exception.CustomAccessDeniedException;
import com.fintech.digitalbanking.exception.InsufficientFundsException;
import com.fintech.digitalbanking.exception.RoleNotFoundException;
import com.fintech.digitalbanking.repository.AccountRepository;
import com.fintech.digitalbanking.repository.TransactionRepository;
// import com.fintech.digitalbanking.repository.UserRepository; // No longer needed
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
class TransactionServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private SecurityUtil securityUtil;

    @InjectMocks
    private TransactionService transactionService;

    private User testUser;
    private Account sourceAccount;
    private Account targetAccount;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(1L).username("testuser").build();

        sourceAccount = Account.builder()
                .id(1L)
                .user(testUser)
                .accountNumber("ACC-SOURCE-123")
                .balance(new BigDecimal("1000.00"))
                .active(true)
                .build();

        targetAccount = Account.builder()
                .id(2L)
                .user(new User()) // Different user
                .accountNumber("ACC-TARGET-456")
                .balance(new BigDecimal("500.00"))
                .active(true)
                .build();
    }

    // --- DEPOSIT TESTS ---
    @Test
    void deposit_shouldSucceed_whenAccountExists() {
        // Arrange
        // Use the new locking method
        when(accountRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(sourceAccount));
        when(securityUtil.isAdmin()).thenReturn(true);
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        transactionService.deposit(1L, new BigDecimal("200.00"));

        // Assert
        assertEquals(new BigDecimal("1200.00"), sourceAccount.getBalance());
        verify(accountRepository, times(1)).save(sourceAccount);
    }

    @Test
    void deposit_shouldThrowException_whenAccountNotFound() {
        // Arrange
        when(accountRepository.findByIdForUpdate(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RoleNotFoundException.class, () -> {
            transactionService.deposit(99L, new BigDecimal("100.00"));
        });
    }

    // --- WITHDRAW TESTS ---
    @Test
    void withdraw_shouldSucceed_whenFundsAreSufficient() {
        // Arrange
        when(accountRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(sourceAccount));
        when(securityUtil.getCurrentUserEntity()).thenReturn(testUser);
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        transactionService.withdraw(1L, new BigDecimal("300.00"));

        // Assert
        assertEquals(new BigDecimal("700.00"), sourceAccount.getBalance());
    }

    @Test
    void withdraw_shouldThrowException_whenFundsAreInsufficient() {
        // Arrange
        when(accountRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(sourceAccount));
        when(securityUtil.getCurrentUserEntity()).thenReturn(testUser);

        // Act & Assert
        assertThrows(InsufficientFundsException.class, () -> {
            transactionService.withdraw(1L, new BigDecimal("2000.00"));
        });
    }

    @Test
    void withdraw_shouldThrowException_whenAccountIsInactive() {
        // Arrange
        sourceAccount.setActive(false);
        when(accountRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(sourceAccount));
        // We must also mock the ownership check
        when(securityUtil.getCurrentUserEntity()).thenReturn(testUser);

        // Act & Assert
        assertThrows(CustomAccessDeniedException.class, () -> {
            transactionService.withdraw(1L, new BigDecimal("100.00"));
        });
    }

    // --- TRANSFER TESTS ---
    @Test
    void transfer_shouldSucceed_forValidTransfer() {
        // Arrange
        // Mock the new repository methods that use locks
        when(accountRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(sourceAccount));
        when(accountRepository.findByAccountNumberForUpdate(targetAccount.getAccountNumber()))
                .thenReturn(Optional.of(targetAccount));
        when(securityUtil.getCurrentUserEntity()).thenReturn(testUser);

        // Act
        // Call the 'transfer' method with the new signature (Long, String, BigDecimal)
        transactionService.transfer(1L, targetAccount.getAccountNumber(), new BigDecimal("500.00"));

        // Assert
        assertEquals(new BigDecimal("500.00"), sourceAccount.getBalance());
        assertEquals(new BigDecimal("1000.00"), targetAccount.getBalance());
        verify(accountRepository, times(1)).save(sourceAccount);
        verify(accountRepository, times(1)).save(targetAccount);
    }

    @Test
    void transfer_shouldThrowException_whenSourceAccountNotFound() {
        // Arrange
        when(accountRepository.findByIdForUpdate(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RoleNotFoundException.class, () -> {
            // Use the new signature
            transactionService.transfer(99L, targetAccount.getAccountNumber(), new BigDecimal("100.00"));
        });
    }

    // --- ROLLBACK TESTS ---
    @Test
    void rollbackTransaction_shouldReverseDeposit() {
        // Arrange
        Transaction depositTx = Transaction.builder()
                .id(10L)
                .type(TransactionType.DEPOSIT)
                .amount(new BigDecimal("200.00"))
                .sourceAccount(sourceAccount)
                .reversed(false)
                .build();

        when(transactionRepository.findById(10L)).thenReturn(Optional.of(depositTx));
        // Mock the 'withdraw' call that happens inside rollback
        when(accountRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(sourceAccount));
        when(securityUtil.getCurrentUserEntity()).thenReturn(testUser);
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(inv -> inv.getArgument(0));

        // Act
        transactionService.rollbackTransaction(10L);

        // Assert
        assertEquals(new BigDecimal("800.00"), sourceAccount.getBalance()); // 1000 - 200
        assertTrue(depositTx.isReversed());
    }

    @Test
    void rollbackTransaction_shouldThrowException_ifAlreadyReversed() {
        // Arrange
        Transaction tx = Transaction.builder().id(10L).reversed(true).build();
        when(transactionRepository.findById(10L)).thenReturn(Optional.of(tx));

        // Act & Assert
        assertThrows(CustomAccessDeniedException.class, () -> {
            transactionService.rollbackTransaction(10L);
        });
    }
}