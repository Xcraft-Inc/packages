#include <unistd.h>
#include <stdio.h>

int
main(void) {
  if (setgid(0))
  {
    perror("setgid");
    return 1;
  }
  if (setuid(0))
  {
    perror("setuid");
    return 1;
  }

  execl("/usr/bin/contelia_upgrade.sh", "contelia_upgrade.sh", NULL);
  perror("execl has failed");
  return 1;
}
