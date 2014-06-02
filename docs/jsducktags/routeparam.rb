require "jsduck/tag/tag"
require "jsduck/doc/subproperties"
require "jsduck/render/subproperties"

module JsDuck::Tag
  class Routeparam < Tag
    def initialize
      @pattern = "routeparam"
      @tagname = :routeparam
      @repeatable = true
      @html_position = POS_PARAM
    end

    # @routeparam {Type} [name=default] (optional) ...
    def parse_doc(p, pos)
      tag = p.standard_tag({
                               :tagname => :routeparam,
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
      h[:routeparam] = JsDuck::Doc::Subproperties.nest(tags, pos)
      h[:routeparam] = nil if h[:routeparam].length == 0
    end

    def format(m, formatter)
      m[:routeparam].each {|p| formatter.format_subproperty(p) }
    end

    def to_html(m)
      JsDuck::Render::Subproperties.render_params(m[:routeparam]) if m[:routeparam].length > 0
    end

  end
end