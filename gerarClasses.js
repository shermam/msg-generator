module.exports = gerarClasses;

function gerarClasses(messageObject) {
    const fileName = messageObject.Name;
    const content = `namespace PostoFacil.Communication.Message
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;

${writeClass(false)(messageObject)}

${messageObject.Attributes
            .filter(attr => attr.Attributes)
            .map(attr => {
                attr.Name = attr.Type.replace('List<', '').replace('>', '');
                return attr;
            })
            .map(writeClass(true))
            .join('\n\n')}
}`;
    return { fileName, content };
}

function writeProperty(attr) {
    return `\t\t/// <summary>
        /// ${attr.Description}
        /// </summary>
        public ${attr.Type} ${attr.Name} { get; set; }`;
}

function writeInitialization(attr) {
    return `\t\t\t${attr.Name} = new ${attr.Type}();`;
}

function writeEnum(attr) {
    return `\t\t/// <summary>
        /// Opções de ${attr.Description}
        /// </summary>
        public enum ${attr.Type}
        {
${attr.ValidValues.map(vv => `\t\t\t/// <summary>
            /// ${vv.name}.
            /// </summary>
            ${vv.code}`).join(",\n\n")}
        }`;
}

function writeClass(skipInheritance) {
    return (messageObject) => {
        return `\t/// <summary>
	/// ${messageObject.Description.replace('Lista de ', '')}
	/// </summary>
    public partial class ${messageObject.Name}${skipInheritance ? '' : ' : BaseInnerMessage'}
    {   
        //----------------------------------------------------------------------------------------------------------------------------------
        //--- Construtores
        //----------------------------------------------------------------------------------------------------------------------------------
        /// <summary>
        /// Construtor padrão da classe. Utilizado pelo desserializador
        /// </summary>
        public ${messageObject.Name}()${skipInheritance ? '' : ` : base(EnumEventType.${messageObject.Name})`}      
        {
${messageObject.Attributes
                .filter(attr => attr.Type.startsWith('List'))
                .map(writeInitialization)
                .join("\n")}
        }

		//--------------------------------------------------------------------
		//--- Atributos-Propriedades públicos
		//--------------------------------------------------------------------
${messageObject.Attributes.map(writeProperty).join("\n\n")}

${messageObject.Attributes
                .filter(attr => attr.ValidValues)
                .map(writeEnum)
                .join("\n\n")}
    }`;
    }
}