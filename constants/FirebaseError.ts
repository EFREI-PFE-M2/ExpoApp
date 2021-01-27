const errorCode: { [key: string]: string } = {
  'auth/invalid-email': 'Addresse invalide',
  'auth/user-disabled': 'Access forbidden',
  'auth/user-not-found': 'Utilisateur inconnue',
  'auth/wrong-password': 'Mot de passe incorrecte',
  'auth/email-already-in-use': 'Email existant',
  'auth/operation-not-allowed': 'Contactez le support',
  'auth/weak-password': 'Mot de passe faible',
}

export const FirebaseAuthError = (errorName: string): string => {
  return errorCode.hasOwnProperty(errorName)
    ? errorCode[errorName]
    : 'Not found'
}
