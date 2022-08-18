import crypto, { KeyObject, KeyPairKeyObjectResult, JsonWebKey } from "node:crypto";

export function generateEd25519KeyPair(): KeyPairKeyObjectResult {
    return crypto.generateKeyPairSync("ed25519");
}

export function exportPublickey(publicKey: KeyObject): JsonWebKey {
    return publicKey.export({format: "jwk"});
}
