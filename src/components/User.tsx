import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function User(user: {
  name: string;
  image: string;
  id: number;
  email: string;
}) {
  return (
    <div className="flex flex-row justify-between gap-2">
      <p className="flex flex-col">
        Hello <span className="text-xl font-semibold">{user.name}</span>
      </p>
      <Avatar>
        <AvatarImage src={user.image} alt="image" />
        <AvatarFallback>I</AvatarFallback>
      </Avatar>
    </div>
  );
}
