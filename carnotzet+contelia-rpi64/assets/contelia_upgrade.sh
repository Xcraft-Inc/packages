#!/bin/sh

echo "running id: $(id)" | logger -t contelia_upgrade

wpkg_upgrade() {
  local result=1
  local sources="/boot/sources.list"
  local backup="/tmp/sources.list.update"
  local log="/tmp/contelia_upgrade.log"

  cp -f "$sources" "$backup" || return 1
  echo "wpkg file:///tmp/contelia_update/ rpiz2w/" >"$sources" || return 1

  if (wpkg --update >"$log" 2>&1) && \
     (wpkg --upgrade >"$log" 2>&1) && \
     (wpkg --autoremove >"$log" 2>&1)
  then
    result=0
  fi

  cat "$log" | logger -t contelia_upgrade
  rm -rf "$log"

  cp -f "$backup" "$sources"
  return $result
}

if wpkg_upgrade; then
  echo "reboot after upgrade" | logger -t contelia_upgrade
  nohup reboot -d 5 &
  exit 0
fi

echo "upgrade error" | logger -t contelia_upgrade
exit 1