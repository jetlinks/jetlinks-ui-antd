export interface CertificateItem {
  id: string;
  name: string;
  description: string;
  instance: string;
  configs: {
    keystoreBase64: string;
    trustKeyStoreBase64: string;
    keystorePwd: string;
    trustKeyStorePwd: string;
  };
}
