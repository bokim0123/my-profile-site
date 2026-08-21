using readLoadCell.Logging;

namespace readLoadCell;

static class Program
{
    [STAThread]
    static void Main()
    {
        ApplicationConfiguration.Initialize();

        Application.ThreadException += Application_ThreadException;
        AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;

        Application.Run(new MainForm());
    }

    private static void Application_ThreadException(object sender, System.Threading.ThreadExceptionEventArgs e)
    {
        AppLogger.Error("UI 스레드 예외", e.Exception);
        MessageBox.Show(
            $"예기치 않은 오류가 발생했습니다.\n\n{e.Exception.Message}",
            "오류",
            MessageBoxButtons.OK,
            MessageBoxIcon.Error
        );
    }

    private static void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
    {
        if (e.ExceptionObject is Exception ex)
        {
            AppLogger.Error("처리되지 않은 예외", ex);
            MessageBox.Show(
                $"심각한 오류가 발생했습니다.\n\n{ex.Message}",
                "심각한 오류",
                MessageBoxButtons.OK,
                MessageBoxIcon.Stop
            );
        }
    }
}