import crypto from "crypto";

export function decryptResponse(responseFromApi: string) {
  const payload = JSON.parse(Buffer.from(responseFromApi, "base64").toString());
  const encryptedKey = Buffer.from(payload.key, "base64");
  const iv = Buffer.from(payload.iv, "base64");
  const encryptedData = Buffer.from(payload.data, "base64");

  const rawPrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3wz8i19JvBPWT
871F0rhuxDNlQLNF1cLdPQWEPRatBOVCnAVPauEhtdparKpy4WTwG31QQGD3Idsf
TgZoFtiGnlhkLv4QUPmH0xGY+lnU42ghIZYkLC9KAeBJA+JSXIEbjy10q8uIbgiT
EbR6IrKV+QJ9lfnx33JcFumxXd1rxJCustvC3NLhjgBprB9NanSR76MVBDUnL5af
NZ1Dohjr6/5yCUvTjRjGXzH8eiGxVEv6csA80CDRw/zBCzawSSaN/FE0cz/pFXhH
/57RgIZf8U8q4fmm0oZqJ0PRZlVqf2K+rhwELylLS7A0kc3ETATqsuqK3Lt9jDO0
8bumYd6JAgMBAAECggEALrZjsMRDGnScxqjhdsPbnVCjrfv19m0h1WKDKfvrbTz+
2GFX2jnVk9+p633T8FMKeRzLzKAo5fmFvZ30c/ZGwWW0G3d0nwoufE/zu7r8JelO
2YkzpOtUdBApBvaFTCF2sl5BlFRtbzdlV5lbEucKFaSQdQMwX8NIy08JxcwSEqgd
R75v27ZyGwo5IaDyhf/LGwsufmScjbq4Q79fzpgOrmM9FcDG7DQPVrX8e4j/l696
v6Zt4Gz6q2oT9YWHn4ybSk1yV+/DCgf8H2u4Um5qmzseoSBonqhTldEJxzOQNj79
xfP1KnnQ+8ikantbWbgjmyqGz9z0j8B09KXYLo5QBwKBgQDZronHMylLDGOwCbwJ
X3fjI4p4ADazCyUfOFJFmfCbNXQpIs3y0mUDYrQsbotJLkOUp1yaZyVTgXa7GaM1
S2DxLKNgShLYLQfHK8yCdyPg5aYQA6AyGghy0w6woPArZXJDhuhHnwAITL+2QFAn
IHbu/icAEXMpCNO6FydeD5LKvwKBgQDYHDOBRxzJdrOikLnBMuZ7C2oZs1K08dkA
W3fxwntTxTyUfE/YEkCP2W7IGGjS7GMNKRJMTKsdlTG0wYeY0ryCI0sd13Nz1saQ
rDXRuQQ76h72V7MYxOa/M8mS4s8RqK3w3YdgwT7nQLSt8PizVtx23AxnddPu5+x8
40n+3PkQtwKBgAlMAghm7/mLkupe0BAaarVhvDU51Rw6eqBluGXOmE8YrlhfaypW
wAev/H/1TK+YcTx1FWhmxVpWqip9gtHw4TgLrwKax0lCSxW/kiF0Uyz0we3nKb1a
DUhSKUtz5C4GTCYEKgF9EfRIyttOzd2N7mZwplvDYwa6oMhO2tiSk7NjAoGBAJYJ
nkiW0omce8LVr+FOMW4j0pndQgKWFg6FcpTKbU0PlquQUu60XVaBosQRDlXCAFLW
vPl0ESkMt+HCqx2S0YWYc0JYnrNB3cH7jbH5PdNLDAwDfzgnG/yLO9ta1GByN7EO
XDr0b3OmHMrWjhQUriNnSsVZrLYlFq7uLiVfzRupAoGBAIt6iQVCmpg82U0Bv8TX
cs4v4Qn2IFzPUvMlfXvQUeSGKY6FO8MI+AD0rhMeFhPY28GARJbjAsFWmP8kiyCp
EpXk/lJ/xwINuuIt+gt2Ks+CRv2BqCQgVc43wu2e/VoJJavzeIrKVOF0U2hANpyx
Xwbk6RHsPcak88F3l3UBFu9P
-----END PRIVATE KEY-----`;


  const privateKey = rawPrivateKey.replace(/\\n/g, "\n");

  const aesKey = crypto.privateDecrypt(
    { key: privateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
    encryptedKey
  );

  const decipher = crypto.createDecipheriv("aes-256-cbc", aesKey, iv);

  const decrypted = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString());
}