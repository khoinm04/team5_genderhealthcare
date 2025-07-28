// src/utils/statusMap.js
import {
  CheckCircle,
  Clock,
  CalendarCheck,
  Activity,
  XCircle,
  Repeat,
  AlertCircle
} from "lucide-react";

export const statusMap = {
  pending: {
    label: "Chờ xác nhận",
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock,
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "bg-blue-100 text-blue-700",
    icon: CheckCircle,
  },
  scheduled: {
    label: "Đã lên lịch",
    color: "bg-blue-100 text-blue-700",
    icon: CalendarCheck,
  },
  rescheduled: {
    label: "Đã dời lịch",
    color: "bg-blue-100 text-blue-700",
    icon: Repeat,
  },
  ongoing: {
    label: "Đang thực hiện",
    color: "bg-yellow-100 text-yellow-800",
    icon: Activity,
  },
  in_progress: {
    label: "Đang xét nghiệm",
    color: "bg-yellow-100 text-yellow-800",
    icon: Activity,
  },
  completed: {
    label: "Hoàn thành",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  canceled: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
  cancelled: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
};
