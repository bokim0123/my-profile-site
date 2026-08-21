using System.IO.Ports;
using System.Text;
using readLoadCell.Logging;

namespace readLoadCell.Communication
{
    public class LoadCellCommunication : IDisposable
    {
        private SerialPort? _serialPort;
        private readonly StringBuilder _receiveBuffer = new StringBuilder();
        private const int MaxBufferSize = 4096;
        private const string Delimiter = "\r\n";

        public bool IsConnected { get; private set; }
        public string PortName { get; private set; } = string.Empty;

        public event EventHandler<string>? RawFrameReceived;
        public event EventHandler<Exception>? CommunicationError;
        public event EventHandler? Connected;
        public event EventHandler? Disconnected;

        public LoadCellCommunication()
        {
        }

        public void Open(SerialPortSettings settings)
        {
            if (IsConnected)
                Close();

            try
            {
                PortName = settings.PortName;
                _serialPort = new SerialPort(
                    settings.PortName,
                    settings.BaudRate,
                    settings.Parity,
                    settings.DataBits,
                    settings.StopBits)
                {
                    Handshake = Handshake.None,
                    ReadTimeout = 500,
                    WriteTimeout = 500
                };

                _serialPort.DataReceived += Port_DataReceived;
                _serialPort.ErrorReceived += Port_ErrorReceived;

                _serialPort.Open();
                IsConnected = true;
                _receiveBuffer.Clear();

                AppLogger.Info($"포트 {settings.PortName} 연결됨 ({settings.BaudRate} bps)");
                Connected?.Invoke(this, EventArgs.Empty);
            }
            catch (Exception ex)
            {
                IsConnected = false;
                AppLogger.Error($"포트 연결 실패: {settings.PortName}", ex);
                CommunicationError?.Invoke(this, ex);
                throw;
            }
        }

        public void Close()
        {
            try
            {
                if (_serialPort != null)
                {
                    if (_serialPort.IsOpen)
                    {
                        _serialPort.DataReceived -= Port_DataReceived;
                        _serialPort.ErrorReceived -= Port_ErrorReceived;
                        _serialPort.Close();
                    }
                    _serialPort.Dispose();
                    _serialPort = null;
                }

                IsConnected = false;
                _receiveBuffer.Clear();
                AppLogger.Info($"포트 {PortName} 연결 해제");
                Disconnected?.Invoke(this, EventArgs.Empty);
            }
            catch (Exception ex)
            {
                AppLogger.Error("포트 해제 중 오류", ex);
            }
        }

        public bool SendCommand(string command)
        {
            if (!IsConnected || _serialPort == null || !_serialPort.IsOpen)
                return false;

            try
            {
                var commandWithCR = command.EndsWith("\r") || command.EndsWith("\n")
                    ? command
                    : command + "\r";

                _serialPort.Write(commandWithCR);
                AppLogger.Info($"명령 송신: {command}");
                return true;
            }
            catch (Exception ex)
            {
                AppLogger.Error($"명령 송신 실패: {command}", ex);
                CommunicationError?.Invoke(this, ex);
                return false;
            }
        }

        private void Port_DataReceived(object sender, SerialDataReceivedEventArgs e)
        {
            if (_serialPort == null || !_serialPort.IsOpen)
                return;

            try
            {
                var data = _serialPort.ReadExisting();
                if (string.IsNullOrEmpty(data))
                    return;

                _receiveBuffer.Append(data);

                // 버퍼 오버플로우 방지
                if (_receiveBuffer.Length > MaxBufferSize)
                {
                    AppLogger.Warning($"버퍼 오버플로우 방지 (길이: {_receiveBuffer.Length})");
                    _receiveBuffer.Clear();
                    return;
                }

                ProcessBuffer();
            }
            catch (Exception ex)
            {
                AppLogger.Error("데이터 수신 처리 중 오류", ex);
                CommunicationError?.Invoke(this, ex);
            }
        }

        private void ProcessBuffer()
        {
            var bufferContent = _receiveBuffer.ToString();
            var delimiterIndex = bufferContent.IndexOf(Delimiter);

            while (delimiterIndex >= 0)
            {
                var frame = bufferContent.Substring(0, delimiterIndex);

                if (!string.IsNullOrWhiteSpace(frame))
                {
                    RawFrameReceived?.Invoke(this, frame);
                }

                // 버퍼에서 처리한 프레임과 delimiter 제거
                bufferContent = bufferContent.Substring(delimiterIndex + Delimiter.Length);
                delimiterIndex = bufferContent.IndexOf(Delimiter);

                _receiveBuffer.Clear();
                _receiveBuffer.Append(bufferContent);
            }
        }

        private void Port_ErrorReceived(object sender, SerialErrorReceivedEventArgs e)
        {
            var errorMsg = $"포트 오류: {e.EventType}";
            AppLogger.Error(errorMsg);
            CommunicationError?.Invoke(this, new Exception(errorMsg));

            try
            {
                Close();
            }
            catch (Exception ex)
            {
                AppLogger.Error("포트 오류 후 종료 중 예외", ex);
            }
        }

        public void Dispose()
        {
            Close();
        }
    }
}
