import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
interface AvatarDropDownProps {
  user: User;
  handleLogout: () => void;
}
export default function AvatarDropDown(props: AvatarDropDownProps) {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage
              src={props.user.user_metadata.avatar_url}
              alt="avatar"
            />
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* <DropdownMenuLabel>ws18022@outlook.com</DropdownMenuLabel> */}
          <DropdownMenuCheckboxItem onClick={props.handleLogout}>
            退出登录
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
