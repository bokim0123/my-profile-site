using System.IO.Ports;

namespace readLoadCell.Simulator
{
    /// <summary>
    /// CAS 인디케이터를 시뮬레이션하는 클래스.
    /// com0com으로 생성한 가상 포트 페어의 한쪽(예: COM10)에 연결하여
    /// 주기적으로 CAS 스타일 프레임을 송신한다.
    /// </summary>
    public class CasLoadCellSimulator
    {
        private SerialPort? _serialPort;
        private bool _running;
        private decimal _currentWeight = 0m;
        private readonly Random _random = new Random();

        public void Start(string portName, int intervalMs = 500)
        {
            try
            {
                _serialPort = new SerialPort(portName, 38400, Parity.None, 8, StopBits.One);
                _serialPort.Open();
                _running = true;

                Console.WriteLine($"시뮬레이터 시작: {portName}");
                Console.WriteLine("다음 명령어 사용 가능:");
                Console.WriteLine("  n - 정상 프레임 송신");
                Console.WriteLine("  p - Partial Packet (프레임 2줄로 나누어 송신)");
                Console.WriteLine("  m - Multiple Packet (프레임 2개 한 번에 송신)");
                Console.WriteLine("  g - 쓰레기 데이터");
                Console.WriteLine("  w - 무게값 변경 (자동)");
                Console.WriteLine("  q - 종료");
                Console.WriteLine();

                var inputTask = Task.Run(() => ProcessInput());
                var sendTask = Task.Run(() => SendPeriodicFrames(intervalMs));

                Task.WaitAll(inputTask, sendTask);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"오류: {ex.Message}");
            }
            finally
            {
                Stop();
            }
        }

        private void ProcessInput()
        {
            while (_running)
            {
                var key = Console.ReadKey(true).KeyChar.ToString().ToLower();

                switch (key)
                {
                    case "n":
                        SendNormalFrame();
                        break;
                    case "p":
                        SendPartialPacket();
                        break;
                    case "m":
                        SendMultiplePackets();
                        break;
                    case "g":
                        SendGarbageData();
                        break;
                    case "w":
                        _currentWeight += 10m;
                        Console.WriteLine($"무게 변경됨: {_currentWeight}");
                        break;
                    case "q":
                        _running = false;
                        break;
                }
            }
        }

        private void SendPeriodicFrames(int intervalMs)
        {
            while (_running)
            {
                try
                {
                    // 실시간 무게 변동 시뮬레이션
                    _currentWeight += (decimal)(_random.NextDouble() * 2 - 1);
                    if (_currentWeight < 0) _currentWeight = 0;
                    if (_currentWeight > 200) _currentWeight = 200;

                    SendNormalFrame();
                    Thread.Sleep(intervalMs);
                }
                catch
                {
                    Thread.Sleep(100);
                }
            }
        }

        private void SendNormalFrame()
        {
            if (_serialPort == null || !_serialPort.IsOpen)
                return;

            // 추정 포맷: "ST,GS,+  1234.5,kg\r\n"
            var frame = FormatFrame("ST", "GS", _currentWeight, "kg");
            _serialPort.Write(frame);
            Console.WriteLine($"[송신] {frame.Replace("\r\n", "\\r\\n")}");
        }

        private void SendPartialPacket()
        {
            if (_serialPort == null || !_serialPort.IsOpen)
                return;

            // 프레임을 두 부분으로 나누어 송신 (Partial Packet 테스트)
            var frame = FormatFrame("ST", "GS", _currentWeight, "kg");
            var mid = frame.Length / 2;

            _serialPort.Write(frame.Substring(0, mid));
            Console.WriteLine($"[송신1] {frame.Substring(0, mid).Replace("\r\n", "\\r\\n")}");

            Thread.Sleep(100);

            _serialPort.Write(frame.Substring(mid));
            Console.WriteLine($"[송신2] {frame.Substring(mid).Replace("\r\n", "\\r\\n")}");
        }

        private void SendMultiplePackets()
        {
            if (_serialPort == null || !_serialPort.IsOpen)
                return;

            // 프레임 2개를 한 번에 송신 (Multiple Packet 테스트)
            var frame1 = FormatFrame("ST", "GS", _currentWeight, "kg");
            var frame2 = FormatFrame("ST", "GS", _currentWeight + 10, "kg");
            var combined = frame1 + frame2;

            _serialPort.Write(combined);
            Console.WriteLine($"[송신] {combined.Replace("\r\n", "\\r\\n")}");
        }

        private void SendGarbageData()
        {
            if (_serialPort == null || !_serialPort.IsOpen)
                return;

            var garbage = "GARBAGE_DATA_12345\r\n";
            _serialPort.Write(garbage);
            Console.WriteLine($"[송신] {garbage.Replace("\r\n", "\\r\\n")}");
        }

        private static string FormatFrame(string status, string mode, decimal weight, string unit)
        {
            // 추정 포맷에 맞춰서 프레임 생성
            return $"{status},{mode},{weight:+0.0;-0.0;0},{unit}\r\n";
        }

        private void Stop()
        {
            _running = false;

            if (_serialPort != null)
            {
                if (_serialPort.IsOpen)
                    _serialPort.Close();
                _serialPort.Dispose();
            }

            Console.WriteLine("시뮬레이터 종료");
        }
    }
}
