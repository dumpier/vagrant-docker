# vagrant builder

require 'fileutils'

#required_plugins = %w(vagrant-ignition vagrant-vbguest vagrant-disksize)
required_plugins = %w(vagrant-vbguest vagrant-disksize vagrant-winnfsd)

plugins_to_install = required_plugins.select { |plugin| not Vagrant.has_plugin? plugin }
if not plugins_to_install.empty?
	puts "Installing plugins: #{plugins_to_install.join(' ')}"

	if system "vagrant plugin install #{plugins_to_install.join(' ')}"
		exec "vagrant #{ARGV.join(' ')}"
	else
		abort "Installation of one or more plugins has failed. Aborting."
	end
end

Vagrant.configure("2") do |config|
	config.ssh.insert_key = false
	config.vm.box = $VM_BOX

	config.vm.provider :virtualbox do |v|
		v.check_guest_additions = false
		v.functional_vboxsf	 = false
		v.memory = 1024
		v.cpus = 1
	end

	if Vagrant.has_plugin?("vagrant-vbguest") then
		config.vbguest.auto_update = false
	end

	# 共有フォルダ
	$SHARED_FOLDERS.each_with_index do |(host_folder, guest_folder), index|
		#config.vm.synced_folder host_folder.to_s, guest_folder.to_s, id: "vagrant-share%02d" % index, nfs: true, mount_options: ['nolock,vers=3,udp']
		config.vm.synced_folder host_folder.to_s, guest_folder.to_s, nfs: true
	end

	# ポートの中継
	$FORWARED_PORTS.each do |guest, host|
		config.vm.network "forwarded_port", guest: guest, host: host, auto_correct: true
	end

	# IPアドレス
	$PRIVATE_IP_LIST.each do |ip, host|
		config.vm.network "private_network", ip: ip
		if host
			config.vm.hostname = host
		end
	end

	Docker.build(config)
end


class Docker
	# docker-composeインストール等
	def self.build(config)
		# Bargeosの場合
		if $VM_BOX.include?("barge") || $VM_BOX.include?("alpine")
			config.vm.provision :shell, privileged: true, inline: <<-SHELL
				/etc/init.d/docker restart #{$DOCKER_VER}
			SHELL
		end

		# docker-composeのインストール
		config.vm.provision :shell, privileged: true, inline: <<-SHELL
			mkdir -p /opt/bin
			wget -L https://github.com/docker/compose/releases/download/v#{$DOCKER_COMPOSE_VER}/docker-compose-`uname -s`-`uname -m` -O /opt/bin/docker-compose
			chmod +x /opt/bin/docker-compose
		SHELL

		# docker-composeビルド
		config.vm.provision :shell, privileged: false, inline: <<-SHELL
			cd /vagrant/docker && docker-compose build
		SHELL

		# docker-compose起動
		config.vm.provision "shell", privileged: false, run: 'always', inline: <<-SHELL
			# cd /vagrant/docker && docker network create --driver bridge proxy
			cd /vagrant/docker && docker-compose up -d 1>&2
		SHELL
	end
end