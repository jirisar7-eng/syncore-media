/* ID-START: AUTH_ST_001 */
export interface UserContext {
    username: string;
    role: 'admin' | 'host';
    token?: string;
}

const ADMIN_CREDENTIALS = {
    user: "Mallfurion",
    pass: "1234",
    email: "sarji@seznam.cz"
};

export const loginAsHost = (): UserContext => {
    const ctx: UserContext = { username: "Host", role: 'host' };
    localStorage.setItem('syn_auth', JSON.stringify(ctx));
    return ctx;
};

export const loginAsAdmin = (u: string, p: string): UserContext | null => {
    if (u === ADMIN_CREDENTIALS.user && p === ADMIN_CREDENTIALS.pass) {
        const ctx: UserContext = { username: u, role: 'admin', token: 'SYN_REFX_889' };
        localStorage.setItem('syn_auth', JSON.stringify(ctx));
        return ctx;
    }
    return null;
};

export const getSession = (): UserContext | null => {
    const data = localStorage.getItem('syn_auth');
    return data ? JSON.parse(data) : null;
};
/* ID-END: AUTH_ST_001 */
