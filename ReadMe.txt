## Installation
Run 'yarn' at the project's folder.

## Usage
run 'yarn start'.

Follow the connection instructions:
Type the name of your folder at the server if has, else type a name and new folder will be created if the name doesn't exist yet.
Put your password or choose one if it is a new folder.
Thats it, you are connected to the server.

Available commands: dir, cd, download and help
Detailed commands explenation:
* For all commands: any data that passes after the necessary arguments is ignored.
	dir:
		returns information about the current directory's content.
		Information includes: 
			regular: item name, file type (' - ' sign for directories), file/dir flag.
			extra data (for files only and by using the 'extra' option): size(bytes), count of downloads, creation time.
			options: 
				extra: can be marked by '+' or 'extra' after the command.

			usage: 
				$:dir
				$:dir extra -> for extra data
				$:dir + -> same as 'extra'

	cd:
		cd command usage is to change the current location. 
		use '..' to climb stage, or 'inner-folder-name' to get into inner folder.
		usage:
			$:cd .. -> stages back to the parent directory. stops at the root client folder.
			$:cd <folder-name> stages into the folder.

	download:
		use download command to download files.
		download command takes a path to the file which is relates to the current folder in the tree.
		NOTE: download command does not accept '..' and global paths. only local paths.
		The downloaded file will be saved into the project directory in the same folders tree in a folder named by default 'downloads'.
		usage:
			$:download <local/path/to/file>