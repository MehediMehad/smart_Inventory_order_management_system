export default function NoDataFound({
  message = "No data found",
}: {
  message?: string;
}) {
  return (
    <div className="flex h-52 w-full flex-col items-center justify-center rounded-md bg-muted p-6 text-center">
      <p className="text-lg font-medium text-muted-foreground">{message}</p>
    </div>
  );
}
