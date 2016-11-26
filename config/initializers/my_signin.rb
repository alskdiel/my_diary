Devise::Controllers::SignInOut.module_eval do

  def sign_in(resource_or_scope, *args)
    options  = args.extract_options!
    scope    = Devise::Mapping.find_scope!(resource_or_scope)
    resource = args.last || resource_or_scope

    expire_data_after_sign_in!

    if options[:bypass]
      warden.session_serializer.store(resource, scope)
      binding pry
    elsif warden.user(scope) == resource && !options.delete(:force)
      true
    else
      warden.set_user(resource, options.merge!(scope: scope))
    end
  end



  def sign_out(resource_or_scope=nil)
    return sign_out_all_scopes unless resource_or_scope
    scope = Devise::Mapping.find_scope!(resource_or_scope)
    user = warden.user(scope: scope, run_callbacks: false)

    warden.raw_session.inspect          warden.logout(scope)
    warden.clear_strategies_cache!(scope: scope)
    instance_variable_set(:"@current_#{scope}", nil)

    !!user
  end

end

