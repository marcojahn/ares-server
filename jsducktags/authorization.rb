#based on @param

require "cgi"
require "jsduck/tag/tag"
require "jsduck/doc/subproperties"
require "jsduck/render/subproperties"

module JsDuck::Tag
  class Authorization < Tag

    def initialize
      @pattern = "authorization"
      @tagname = :authorization
      @repeatable = true
      @html_position = POS_PARAM
    end

    # @authorization {Type} [name=default] (optional) ...
    def parse_doc(p, pos)
      tag = p.standard_tag({
        :tagname => :authorization,
        :type => true,
        :name => true,
        :default => true,
        :optional => true
      })
      tag[:optional] = true if parse_optional(p)
      tag[:doc] = :multiline
      tag
    end

    def parse_optional(p)
      p.hw.match(/\(optional\)/i)
    end

    def process_doc(h, tags, pos)
      h[:authorization] = JsDuck::Doc::Subproperties.nest(tags, pos)
      h[:authorization] = nil if h[:authorization].length == 0
    end

    def format(m, formatter)
      m[:authorization].each {|p| formatter.format_subproperty(p) }
    end

    def to_html(m)
      render_authorization(m[:authorization]) if m[:authorization].length > 0
    end

    def render_authorization(params)
      return [
          '<h3 class="pa">Authorization</h3>',
          render_authorization_list(params),
      ]
    end

    def render_authorization_list(params)
      return [
          "<ul>",
          params.map {|p| render_single_authorization_param(p) },
          "</ul>",
      ]
    end

    def render_single_authorization_param(p)
      return [
          "<li>",
            "<span class='pre'>#{p[:html_type]}</span> : ",
            p[:name],
            #p[:optional] ? " (optional)" : "",
            #p[:new] ? render_new : "",
            "<div class='sub-desc'>",
              p[:doc],
              p[:default] ? "<p>Defaults to: <code>#{CGI.escapeHTML(p[:default])}</code></p>" : "",
              #p[:since] ? render_since(p) : "",
              #p[:properties] && p[:properties].length > 0 ? render(p) : "",
            "</div>",
          "</li>",
      ]
    end

  end
end