export default function FormatDate({ dateString }: { dateString: string }) {
  const now = new Date();
  const messageDate = new Date(dateString);
  const isToday = now.toDateString() === messageDate.toDateString();
  if (isToday) {
    // 如果时间差小于1天，显示小时和分钟
    return messageDate.toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    // 如果时间差大于1天，显示完整日期
    return messageDate.toLocaleDateString("zh-CN");
  }
}
