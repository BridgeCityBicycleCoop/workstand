# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  # All Vagrant configuration is done here. The most common configuration
  # options are documented and commented below. For a complete reference,
  # please see the online documentation at vagrantup.com.

  # Every Vagrant virtual environment requires a box to build off of.
  config.vm.box = "ubuntu/trusty64"
  config.vm.hostname = "bikeshop-dev"
  config.vm.provider "virtualbox" do |v|
    v.name = "bikeshop-dev"
    v.memory = 1024
  end

  # Create a forwarded port mapping which allows access to a specific port
  # within the machine from a port on the host machine. In the example below,
  # accessing "localhost:8080" will access port 80 on the guest machine.
  # config.vm.network "forwarded_port", guest: 8000, host: 80

  # Create a private network, which allows host-only access to the machine
  # using a specific IP.
  config.vm.network "private_network", ip: "192.168.33.45"
  config.vm.hostname = "bikeshop.local"

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  config.vm.synced_folder '.', '/vagrant', disabled: true
  config.vm.synced_folder "bikeshop_project", "/srv/bikeshop"

  config.vm.provision "ansible" do |ansible|
      ansible.groups = {
        "development" => "default"
      }
      ansible.playbook = "provision/site.yml"
      # ansible.ask_sudo_pass = true
      # ansible.verbose = "v"
      ansible.sudo = true
      ansible.host_key_checking = false
      ansible.limit = "default"
      ansible.extra_vars = {
        ansible_ssh_user: 'vagrant',
        ansible_connection: 'ssh',
        ansible_ssh_args: '-o ForwardAgent=yes',
      }
  end
end
