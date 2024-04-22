import AcmeLogo from '@/app/ui/acme-logo';
import LoginForm from '../ui/login-form';

export default function LoginPage() {
    return (
        <main>
            <div>
                <div>
                    <div>
                        <AcmeLogo/>
                    </div>
                </div>
                <LoginForm/>
            </div>
        </main>
    );
}