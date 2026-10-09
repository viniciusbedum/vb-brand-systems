// Importações individuais compatíveis com React Server Components e client components.
import { ArrowCounterClockwiseIcon as ArrowCounterClockwise } from "@phosphor-icons/react/dist/ssr/ArrowCounterClockwise";
import { ArrowLineLeftIcon as ArrowLineLeft } from "@phosphor-icons/react/dist/ssr/ArrowLineLeft";
import { ArrowLineRightIcon as ArrowLineRight } from "@phosphor-icons/react/dist/ssr/ArrowLineRight";
import { ArrowUpIcon as ArrowUp } from "@phosphor-icons/react/dist/ssr/ArrowUp";
import { BookOpenIcon as BookOpen } from "@phosphor-icons/react/dist/ssr/BookOpen";
import { CaretDownIcon as CaretDown } from "@phosphor-icons/react/dist/ssr/CaretDown";
import { CaretRightIcon as CaretRight } from "@phosphor-icons/react/dist/ssr/CaretRight";
import { ChatCircleIcon as ChatCircle } from "@phosphor-icons/react/dist/ssr/ChatCircle";
import { ChatTextIcon as ChatText } from "@phosphor-icons/react/dist/ssr/ChatText";
import { CheckIcon as Check } from "@phosphor-icons/react/dist/ssr/Check";
import { CheckCircleIcon as CheckCircle } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { ClockCounterClockwiseIcon as ClockCounterClockwise } from "@phosphor-icons/react/dist/ssr/ClockCounterClockwise";
import { CopyIcon as Copy } from "@phosphor-icons/react/dist/ssr/Copy";
import { DotsThreeIcon as DotsThree } from "@phosphor-icons/react/dist/ssr/DotsThree";
import { DotsThreeVerticalIcon as DotsThreeVertical } from "@phosphor-icons/react/dist/ssr/DotsThreeVertical";
import { DownloadSimpleIcon as DownloadSimple } from "@phosphor-icons/react/dist/ssr/DownloadSimple";
import { EyeIcon as Eye } from "@phosphor-icons/react/dist/ssr/Eye";
import { FileIcon as File } from "@phosphor-icons/react/dist/ssr/File";
import { FileTextIcon as FileText } from "@phosphor-icons/react/dist/ssr/FileText";
import { FingerprintIcon as Fingerprint } from "@phosphor-icons/react/dist/ssr/Fingerprint";
import { FolderIcon as Folder } from "@phosphor-icons/react/dist/ssr/Folder";
import { GearIcon as Gear } from "@phosphor-icons/react/dist/ssr/Gear";
import { GitBranchIcon as GitBranch } from "@phosphor-icons/react/dist/ssr/GitBranch";
import { HouseIcon as House } from "@phosphor-icons/react/dist/ssr/House";
import { ImageIcon as Image } from "@phosphor-icons/react/dist/ssr/Image";
import { InfoIcon as Info } from "@phosphor-icons/react/dist/ssr/Info";
import { KeyIcon as Key } from "@phosphor-icons/react/dist/ssr/Key";
import { ListIcon as List } from "@phosphor-icons/react/dist/ssr/List";
import { MagnifyingGlassIcon as MagnifyingGlass } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { MonitorIcon as Monitor } from "@phosphor-icons/react/dist/ssr/Monitor";
import { MoonIcon as Moon } from "@phosphor-icons/react/dist/ssr/Moon";
import { MusicNotesIcon as MusicNotes } from "@phosphor-icons/react/dist/ssr/MusicNotes";
import { PencilIcon as Pencil } from "@phosphor-icons/react/dist/ssr/Pencil";
import { PlusIcon as Plus } from "@phosphor-icons/react/dist/ssr/Plus";
import { PushPinIcon as PushPin } from "@phosphor-icons/react/dist/ssr/PushPin";
import { ShapesIcon as Shapes } from "@phosphor-icons/react/dist/ssr/Shapes";
import { SidebarSimpleIcon as SidebarSimple } from "@phosphor-icons/react/dist/ssr/SidebarSimple";
import { SignOutIcon as SignOut } from "@phosphor-icons/react/dist/ssr/SignOut";
import { SquaresFourIcon as SquaresFour } from "@phosphor-icons/react/dist/ssr/SquaresFour";
import { StackIcon as Stack } from "@phosphor-icons/react/dist/ssr/Stack";
import { SunIcon as Sun } from "@phosphor-icons/react/dist/ssr/Sun";
import { TextTIcon as TextT } from "@phosphor-icons/react/dist/ssr/TextT";
import { TrashIcon as Trash } from "@phosphor-icons/react/dist/ssr/Trash";
import { CircleHalfIcon as CircleHalf } from "@phosphor-icons/react/dist/ssr/CircleHalf";
import { DesktopIcon as Desktop } from "@phosphor-icons/react/dist/ssr/Desktop";
import { TranslateIcon as Translate } from "@phosphor-icons/react/dist/ssr/Translate";
import { UploadSimpleIcon as UploadSimple } from "@phosphor-icons/react/dist/ssr/UploadSimple";
import { UserIcon as User } from "@phosphor-icons/react/dist/ssr/User";
import { UsersIcon as Users } from "@phosphor-icons/react/dist/ssr/Users";
import { VideoCameraIcon as VideoCamera } from "@phosphor-icons/react/dist/ssr/VideoCamera";
import { WarningIcon as Warning } from "@phosphor-icons/react/dist/ssr/Warning";
import { WaveSineIcon as WaveSine } from "@phosphor-icons/react/dist/ssr/WaveSine";
import { XIcon as X } from "@phosphor-icons/react/dist/ssr/X";
import { XCircleIcon as XCircle } from "@phosphor-icons/react/dist/ssr/XCircle";

export { CircleHalf, Desktop, Translate, ArrowCounterClockwise, ArrowLineLeft, ArrowLineRight, ArrowUp, BookOpen, CaretDown, CaretRight, ChatCircle, ChatText, Check, CheckCircle, ClockCounterClockwise, Copy, DotsThree, DotsThreeVertical, DownloadSimple, Eye, File, FileText, Fingerprint, Folder, Gear, GitBranch, House, Image, Info, Key, List, MagnifyingGlass, Monitor, Moon, MusicNotes, Pencil, Plus, PushPin, Shapes, SidebarSimple, SignOut, SquaresFour, Stack, Sun, TextT, Trash, UploadSimple, User, Users, VideoCamera, Warning, WaveSine, X, XCircle };

const navigationIcons = { BookOpen, Fingerprint, ChatText, Eye, SquaresFour, WaveSine, Stack, TextT, Image, VideoCamera, MusicNotes, FileText, Shapes, Monitor };

export function getNavigationIcon(name?: string) {
  return navigationIcons[name as keyof typeof navigationIcons] ?? Folder;
}
