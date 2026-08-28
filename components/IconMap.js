"use client";

import {
  Phone,
  MessageCircle,
  Mail,
  Globe,
  MapPin,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
  Music2,
  Send,
  Link as LinkIcon,
  ChevronRight,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  QrCode,
  Download,
} from "lucide-react";

const ICONS = {
  Phone,
  MessageCircle,
  Mail,
  Globe,
  MapPin,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
  Youtube,
  Music2,
  Send,
  Link: LinkIcon,
  ChevronRight,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  QrCode,
  Download,
};

export default function Icon({ name, ...props }) {
  const Cmp = ICONS[name] || LinkIcon;
  return <Cmp {...props} />;
}
