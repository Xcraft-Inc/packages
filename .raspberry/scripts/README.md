## SD Card

```bash
# 1. Create an image with two partitions
fallocate -l 1G carnotzet.img
printf "label: dos\n63,524225,0x0C,*\n524288,,,-\n" | sfdisk carnotzet.img

# 2. Format the first partition to FAT32 with mtools
mformat -i carnotzet.img@@32256 -F -v BOOT :: -N 0 -T 524225

# 3. Copy the boot files into the FAT32 partition
mcopy -i carnotzet.img@@32256 -s carnotzet/boot/* ::

# 4. Format the second partition to ext4 and copy the root files
rm -f carnotzet/boot/*
fakeroot mke2fs -t ext4 -b 4096 -d carnotzet -E offset=268435456 carnotzet.img 196608
```

## Calculs for 1GB

- Partition 1 : 256MB
- Partition 2 : 768MB
- **Total : 1024MB = 1GB**

### Base parameters

- **Total size** : 1GB = 1024MB
- **Sector size** : 512 bytes
- **Total sectors** : 1024 × 1024 × 1024 ÷ 512 = **2097152 sectors**

### Partition 1 (FAT32) - 256MB fixed

| Parameter       | Calcul               | Value      |
| --------------- | -------------------- | ---------- |
| First sector    | Fixed                | **63**     |
| Last sector     | 63 + 524225 - 1      | **524287** |
| Nb of sectors   | 524287 - 63 + 1      | **524225** |
| Size            | 524225 × 512 ÷ 1024² | **256MB**  |
| Offset in bytes | 63 × 512             | **32256**  |

### Partition 2 (ext4) - space left

| Parameter        | Calcul                | Value         |
| ---------------- | --------------------- | ------------- |
| First sector     | Après partition 1     | **524288**    |
| Last sector      | 2097152 - 1           | **2097151**   |
| Nb of sectors    | 2097151 - 524288 + 1  | **1572864**   |
| Size             | 1572864 × 512 ÷ 1024² | **768MB**     |
| Offset in bytes  | 524288 × 512          | **268435456** |
| Blocs ext4 (4KB) | 1572864 ÷ 8           | **196608**    |
