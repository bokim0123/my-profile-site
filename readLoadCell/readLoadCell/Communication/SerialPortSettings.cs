using System.IO.Ports;

namespace readLoadCell.Communication
{
    public class SerialPortSettings
    {
        public string PortName { get; set; } = "COM1";
        public int BaudRate { get; set; } = 38400;
        public int DataBits { get; set; } = 8;
        public StopBits StopBits { get; set; } = StopBits.One;
        public Parity Parity { get; set; } = Parity.None;

        public SerialPortSettings()
        {
        }

        public SerialPortSettings(string portName, int baudRate)
        {
            PortName = portName;
            BaudRate = baudRate;
        }

        public override string ToString() => $"{PortName} {BaudRate}bps {DataBits}N{(int)StopBits}";
    }
}
