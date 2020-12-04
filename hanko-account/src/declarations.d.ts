interface Window {
  PublicKeyCredential: PublicKeyCredential | undefined
  __webpack_public_path__: string | undefined
  resourceBaseUrl: string | undefined
  keycloakUrl: string | undefined
  realmId: string | undefined
  requires2fa: string | undefined
}

interface PublicKeyCredential {
  isUserVerifyingPlatformAuthenticatorAvailable: () => Promise<boolean>
}

interface Navigator {
  userLanguage: string
  language: string
}

declare module '*.svg' {
  const value: React.StatelessComponent<React.SVGAttributes<SVGElement>>
  export default value
}
