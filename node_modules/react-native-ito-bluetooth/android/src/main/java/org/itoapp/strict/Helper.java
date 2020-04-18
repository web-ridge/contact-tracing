package org.itoapp.strict;

import android.util.Log;

import java.nio.ByteBuffer;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.UUID;

import static org.itoapp.strict.Constants.HASH_LENGTH;

public class Helper {

    private static final String LOG_TAG = "Helper";
    private static MessageDigest sha256MessageDigest;

    private Helper() {
    }

    public static byte[] calculateTruncatedSHA256(byte[] uuid) {
        if(sha256MessageDigest == null) {
            try {
                sha256MessageDigest = MessageDigest.getInstance("SHA-256");
            } catch (NoSuchAlgorithmException e) {
                Log.wtf(LOG_TAG, "Algorithm not found", e);
                throw new RuntimeException(e);
            }
        }

        byte[] sha256Hash = sha256MessageDigest.digest(uuid);
        return Arrays.copyOf(sha256Hash, HASH_LENGTH);
    }

    private static final char[] HEX_DIGITS = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'};

    public static String encodeHexString(byte[] data) {
        StringBuilder result = new StringBuilder();
        // two characters form the hex value.
        for (byte b : data) {
            result.append(HEX_DIGITS[(0xF0 & b) >>> 4]);
            result.append(HEX_DIGITS[0x0F & b]);
        }
        return result.toString();

    }
}
