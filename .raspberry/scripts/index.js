'use strict';

class Scripts {
  #ctx;

  constructor(ctx) {
    this.#ctx = ctx;
  }

  genRoot = async (rootDir, assets, pkgs) => {
    const {rm, mkdir, exec} = this.#ctx;
    const wpkg = (...args) => exec('wpkg_static', '--root', rootDir, ...args);

    rm(rootDir);
    mkdir(rootDir);

    /* Prepare the WPKG admin directory */
    await wpkg('--create-admindir', assets + '/admindir.control');
    /* Add the Xcraft Raspberry WPKG source */
    await wpkg('--add-sources', 'wpkg http://127.0.0.1:12321/ raspberry/');
    /* Update the WPKG indices */
    await wpkg('--update');
    /* Deploy the packages */
    await wpkg(
      '--keep-original-symlink-target',
      '--force-file-info',
      '--skip-hooks',
      '--install',
      ...pkgs
    );
  };

  genImage = async (rootDir, output, imageSize = 1024) => {
    const {rm, mkdir, mv, exec} = this.#ctx;
    const sh = (...args) => exec('sh', '-c', ...args);

    /* See README.md */
    const bootMB = 256;
    const sectorSize = 512;
    const fatFirstSec = 63;
    const fatOffset = fatFirstSec * sectorSize;
    const fatNbSec = (bootMB * 1024 * 1024) / sectorSize - fatFirstSec;
    const ext4FirstSec = (bootMB * 1024 * 1024) / sectorSize;
    const ext4Blocs = ((imageSize - bootMB) * 1024 * 1024) / (sectorSize * 8);
    const ext4Offset = ext4FirstSec * sectorSize;

    const items = output.split(/[/\\]/g);
    const name = '__' + items[items.length - 1];

    /* prettier-ignore */ {
    await sh(`fallocate -l ${imageSize}M ${name}`);
    await sh(`printf "label: dos\n${fatFirstSec},${fatNbSec},0x0C,*\n${ext4FirstSec},,,-\n" | sfdisk ${name}`);
    await sh(`mformat -i ${name}@@${fatOffset} -F -v BOOT :: -N 0 -T ${fatNbSec}`);
    await sh(`mcopy -i ${name}@@${fatOffset} -s ${rootDir}/boot/* ::`);
    }

    rm(`${rootDir}/boot`);
    mkdir(`${rootDir}/boot`);

    /* prettier-ignore */
    await sh(`fakeroot mke2fs -t ext4 -b 4096 -O metadata_csum,extent,has_journal -m 0 -d ${rootDir} -E offset=${ext4Offset},lazy_itable_init=0,lazy_journal_init=0 ${name} ${ext4Blocs}`);

    mv(`${name}`, output);
  };

  genInitramfs = async (rootDir, bootDir, mkimage) => {
    const {cd, mkdir, exec} = this.#ctx;

    cd(rootDir);
    mkdir(bootDir);

    /* prettier-ignore */ {
    await exec('sh', '-c', `find . | cpio -o -H newc -R +0:+0 | gzip > ${rootDir}/initramfs.cpio.gz`);
    await exec(mkimage, '-A', 'arm64', '-O', 'linux', '-T', 'ramdisk', '-d', `${rootDir}/initramfs.cpio.gz`, `${bootDir}/uRamdisk`);
    }
  };
}

module.exports = (ctx) => new Scripts(ctx);
