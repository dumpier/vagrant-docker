# -*- mode: ruby -*-
# # vi: set ft=ruby :

# vagrant config
$VM_BOX = 'ailispaw/barge'


$PRIVATE_IP_LIST = ['192.168.56.101', '192.168.56.102']
$FORWARED_PORTS = []
$SHARED_FOLDERS = {
	'./docker'=>'/vagrant/docker',
	'../../project'=>'/vagrant/project',
}

$DOCKER_VER = '20.10.16'
$DOCKER_COMPOSE_VER = '2.17.2'

require './scripts/builder.rb'
