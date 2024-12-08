# 1. 현재 실행 중인 arentcar-0.0.1-SNAPSHOT.jar 프로세스 종료
echo "Stopping existing backend process..."
PID=$(ps aux | grep arentcar-0.0.1-SNAPSHOT.jar | grep -v grep | awk '{print $2}')

if [ -z "$PID" ]; then
  echo "No backend process running."
else
  echo "Killing process ID: $PID"
  kill -9 $PID
fi

echo "Backend Stop successfully."
