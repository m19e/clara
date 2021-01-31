type User = {
    photoURL: string;
};

export default function UserMenu({ user }: { user: User | null }) {
    return (
        <div className="w-9 h-9 ml-2 rounded-full bg-gray-200">
            {user && <img className="w-full h-full rounded-full" src={user.photoURL.replace(/.jpg/, "_normal.jpg")} />}
        </div>
    );
}
