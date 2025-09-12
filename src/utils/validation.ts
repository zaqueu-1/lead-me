export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
