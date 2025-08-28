### Prepare the SD card

It creates two partitions:

1. FAT32 (256 MB)
2. EXT4 (all space)

```bash
dd if=/dev/zero of=/dev/sde bs=1024 count=1024

sfdisk /dev/sde <<EOF
label: dos
63,524225,0x0C,*
524288,,,-
EOF

mkfs.vfat -F32 /dev/sde1 -n boot
mkfs.ext4 /dev/sde2 -L carnotzet
```

### Copy the boot and the root

```bash
rsync -av --delete var/prodroot.raspberry/linux-amd64/var/carnotzet/ /media/$USER/carnotzet/
rsync -av --delete var/prodroot.raspberry/linux-amd64/var/carnotzet/boot/ /media/$USER/boot/
rm -f /media/$USER/carnotzet/boot/*
chown -R 0:0 /media/$USER/carnotzet/

umount /dev/sde1
umount /dev/sde2
```
